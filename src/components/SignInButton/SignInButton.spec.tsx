import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { useSession } from "next-auth/client"
import { SignInButton } from "."

const session = {
	user: {
		name: "John Doe",
		email: "user@example.com",
		image: "image.jpg",
	},
	expires: "123",
}

jest.mock("next-auth/client")

describe("SignInButton", () => {
	it("should render correctly", () => {
		const useSessionMocked = mocked(useSession)

		useSessionMocked.mockReturnValueOnce([session, false])

		render(<SignInButton />)

		expect(screen.getByRole("button")).toBeInTheDocument()
	})

	it("should show user profile when user is logged in", () => {
		const useSessionMocked = mocked(useSession)

		useSessionMocked.mockReturnValueOnce([session, false])

		render(<SignInButton />)

		expect(screen.getByText(session.user.name)).toBeInTheDocument()
	})
})
