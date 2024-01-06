import { buttonVariants } from "@repo/ui/button"
import Link from "next/link"

const TestPage=() => {
    return (
        <div>
            <h1>Test Components</h1>
            <Link href={"/test/email"} className={buttonVariants({ variant: "ghost" })}>Test Emails</Link>
        </div>
    )
}

export default TestPage