import { useRouter } from 'next/router'
import Link from 'next/link'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink'

export function Header() {
  const { asPath } = useRouter()

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active} prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}