import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import Posts, { getStaticProps } from "../../pages/posts"
import { getPrismicClient } from "../../services/prismic"

jest.mock("../../services/prismic.ts")

const posts = [
	{
		slug: "Post",
		title: "Post Title",
		excerpt: "lorem ipsum dolor sit amet, consectetur adipiscing elit",
		updatedAt: "2020",
	},
]

describe("Posts page", () => {
	it("should render correctly", () => {
		render(<Posts posts={posts} />)

		expect(screen.getByText("Post Title")).toBeInTheDocument()
	})

	it("should load data correctly", async () => {
		const getPrismicClientMocked = mocked(getPrismicClient)

		getPrismicClientMocked.mockReturnValueOnce({
			query: jest.fn().mockResolvedValueOnce({
				results: [
					{
						uid: "my-new-post",
						data: {
							title: [{ type: "heading", text: "my new post" }],
							content: [{ type: "paragraph", text: "my post content" }],
						},
						last_publication_date: "04-01-2021",
					},
				],
			}),
		} as any)

		const response = await getStaticProps({})

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					posts: [
						{
							slug: "my-new-post",
							title: "my new post",
							excerpt: "my post content",
							updatedAt: "01 de abril de 2021",
						},
					],
				},
			})
		)
	})
})
