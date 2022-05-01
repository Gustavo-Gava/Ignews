import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { getSession } from "next-auth/client"
import { getPrismicClient } from "../../services/prismic"
import Post, { getServerSideProps } from "../../pages/posts/[slug]"

jest.mock("next-auth/client")
jest.mock("../../services/prismic")

const post = {
	slug: "post-1",
	title: "My Post",
	content: '<p role="content">lorem ipsum dolor sit amet lorem</p>',
	updatedAt: "01 de abril de 2022",
}

describe("Post page", () => {
	it("should render post title and content", () => {
		render(<Post post={post} />)

		expect(screen.getByText(post.title)).toBeInTheDocument()
		expect(screen.getByRole("content")).toBeInTheDocument()
	})

	it("should redirect user when user has not active subscription", async () => {
		const session = {
			user: {
				name: "John Doe",
				email: "user@example.com",
				image: "image.jpg",
			},
			activeSubscription: false,
		}

		const getSessionMocked = mocked(getSession)
		getSessionMocked.mockResolvedValueOnce(session)

		const response = await getServerSideProps({ params: { slug: "my-post" } } as any)

		expect(response).toEqual(
			expect.objectContaining({
				redirect: expect.objectContaining({
					destination: "/",
				}),
			})
		)
	})

	it("should return post data when user has active subscription", async () => {
		const session = {
			user: {
				name: "John Doe",
				email: "user@example.com",
				image: "image.jpg",
			},
			activeSubscription: true,
		}

		const postResponse = {
			data: {
				title: [{ type: "heading", text: "my new post" }],
				content: [{ type: "paragraph", text: "my post content" }],
			},
			last_publication_date: "04-01-2022",
		}

		const postFormatted = {
			slug: "my-post",
			title: "my new post",
			content: "<p>my post content</p>",
			updatedAt: "01 de abril de 2022",
		}

		const getPrismicClientMocked = mocked(getPrismicClient)
		const getSessionMocked = mocked(getSession)

		getSessionMocked.mockResolvedValueOnce(session)
		getPrismicClientMocked.mockReturnValueOnce({
			getByUID: jest.fn().mockResolvedValueOnce(postResponse),
		} as any)

		const response = await getServerSideProps({ params: { slug: "my-post" } } as any)

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post: postFormatted,
				},
			})
		)
	})
})
