import { transformCode, detectLanguage } from '@/lib/transformer'

export async function POST(req: Request) {
  try {
    const { code, sourceLanguage, targetLanguage } = await req.json()

    if (!code || !targetLanguage) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Auto-detect source language if not provided or if it's 'auto'
    let detectedSourceLanguage = sourceLanguage
    if (!sourceLanguage || sourceLanguage === 'auto') {
      detectedSourceLanguage = detectLanguage(code)
    }

    // Transform the code using rule-based transformation
    const result = transformCode(code, detectedSourceLanguage, targetLanguage)

    // Simulate streaming response for consistency with UI
    const response = new ReadableStream({
      start(controller) {
        try {
          // Send the translated code in chunks to simulate streaming
          const chunkSize = 50
          let index = 0

          const sendChunk = () => {
            if (index < result.code.length) {
              const chunk = result.code.slice(index, index + chunkSize)
              index += chunkSize

              const json = JSON.stringify({
                type: 'delta',
                delta: chunk,
                fullText: result.code.slice(0, index),
              })
              controller.enqueue(`data: ${json}\n\n`)

              // Use setTimeout for smooth streaming effect
              setTimeout(sendChunk, 10)
            } else {
              // Send completion signal
              controller.enqueue('data: {"type":"done"}\n\n')
              controller.close()
            }
          }

          sendChunk()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(response, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Translation error:', error)
    return Response.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    )
  }
}
