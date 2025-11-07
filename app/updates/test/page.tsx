'use client'

import { useState } from "react"


const TestPage: React.FC = () => {
    const [count, setCount] = useState<number>(0)
    const [text, setText] = useState<string>('')

    return (
        <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
            <h1>Test Page</h1>
            <p>This is a test page.</p>

            <section style={{ marginTop: 16 }}>
                <label>
                    Type something:{' '}
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="write here..."
                        style={{ padding: 6, marginLeft: 8 }}
                    />
                </label>
                <p style={{ marginTop: 8 }}>You typed: {text || <em>nothing yet</em>}</p>
            </section>

            <section style={{ marginTop: 16 }}>
                <button onClick={() => setCount((c) => c + 1)} style={{ padding: '8px 12px' }}>
                    Increment
                </button>
                <span style={{ marginLeft: 12 }}>Count: {count}</span>
            </section>
        </main>
    )
}

export default TestPage