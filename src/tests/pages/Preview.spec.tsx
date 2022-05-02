import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { getSession, useSession } from "next-auth/client"
import { useRouter } from "next/router"
import { getPrismicClient } from "../../services/prismic"
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]"

jest.mock("next-auth/client")
jest.mock("../../services/prismic")
jest.mock("next/router")

const post = {
	slug: "post-1",
	title: "My Post",
	content: '<p role="content">lorem ipsum dolor sit amet lorem</p>',
	updatedAt: "01 de abril de 2022",
}

describe("Post page", () => {
	it("should render post title and content", () => {
		const useSessionMocked = mocked(useSession)
		useSessionMocked.mockReturnValueOnce([{ activeSubscrition: false }, false])

		render(<PostPreview post={post} />)

		expect(screen.getByText(post.title)).toBeInTheDocument()
		expect(screen.getByRole("content")).toBeInTheDocument()
		expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
	})

	it("should redirect user to the post page when user has activated", () => {
		const useSessionMocked = mocked(useSession)
		const useRouterMocked = mocked(useRouter)
		const pushMock = jest.fn()

		useSessionMocked.mockReturnValueOnce([{ activeSubscription: true }, false])
		useRouterMocked.mockReturnValueOnce({
			push: pushMock,
		} as any)

		render(<PostPreview post={post} />)

		expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`)
	})

	it("should return post data when user has active subscription", async () => {
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

		getPrismicClientMocked.mockReturnValueOnce({
			getByUID: jest.fn().mockResolvedValueOnce(postResponse),
		} as any)

		const response = await getStaticProps({ params: { slug: "my-post" } } as any)

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post: postFormatted,
				},
			})
		)
	})
})
