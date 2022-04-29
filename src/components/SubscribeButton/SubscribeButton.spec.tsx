import { fireEvent, render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { useSession, signIn } from "next-auth/client"
import { useRouter } from "next/router"
import { SubscribeButton } from "."

const session = {
	user: {
		name: "John Doe",
		email: "user@example.com",
		image: "image.jpg",
	},
	activeSubscription: true,
}

jest.mock("next-auth/client")
jest.mock("next/router")

describe("SubscribeButton", () => {
	it("should render 'Posts' when user has activeSubscription", () => {
		const useSessionMocked = mocked(useSession)
		useSessionMocked.mockReturnValueOnce([session, false])

		render(<SubscribeButton priceId="3" />)

		expect(screen.getByText("Posts")).toBeInTheDocument()
	})

	it("should render 'Subscribe now' when user has not active subscription", () => {
		const useSessionMocked = mocked(useSession)
		useSessionMocked.mockReturnValueOnce([null, false])

		render(<SubscribeButton priceId="3" />)

		expect(screen.getByText("Subscribe now")).toBeInTheDocument()
	})

	it("should redirect to signIn when user is unauthenticated", () => {
		const useSessionMocked = mocked(useSession)
		useSessionMocked.mockReturnValueOnce([null, false])

		const signInMocked = mocked(signIn)

		render(<SubscribeButton priceId="2" />)

		const subscribeButton = screen.getByText("Subscribe now")

		fireEvent.click(subscribeButton)

		expect(signInMocked).toHaveBeenCalled()
	})

	it("should redirect to posts when user has activeSubscription", () => {
		const useRouterMocked = mocked(useRouter)
		const pushMock = jest.fn()
		const useSessionMocked = mocked(useSession)

		useSessionMocked.mockReturnValueOnce([session, false])
		useRouterMocked.mockReturnValueOnce({
			push: pushMock,
		} as any)

		render(<SubscribeButton priceId="2" />)

		const subscribeButton = screen.getByText("Posts")

		fireEvent.click(subscribeButton)

		expect(pushMock).toHaveBeenCalledWith("/posts")
	})
})
