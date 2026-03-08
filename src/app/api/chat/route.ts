import { generateText, Output } from 'ai';
import z from 'zod';

const extractedConcertSchema = z.object({
  date: z
    .string()
    .describe('Concert date in ISO 8601 format (e.g., 2026-03-01T21:00:00Z)'),
  artist: z.string(),
  venue: z.string(),
  city: z.string(),
});

type ExtractedConcertData = z.infer<typeof extractedConcertSchema>;

async function isConcertTicketImage(imageUrl: string): Promise<boolean> {
  const result = await generateText({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'You are an image classifier. Check whether the image is a concert ticket or clearly related to a live music event. Reply with only "yes" or "no".',
          },
          {
            type: 'image',
            image: imageUrl,
          },
        ],
      },
    ],
  });

  const answer = result.text.toLowerCase().trim();
  return answer.startsWith('sim') || answer.startsWith('yes');
}

export async function POST(request: Request) {
  const body = await request.json();
  const imageUrl = body.imageUrl;

  if (!imageUrl) {
    return Response.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const isTicket = await isConcertTicketImage(imageUrl);

    if (!isTicket) {
      return Response.json(
        {
          error:
            "This image doesn't look like a concert ticket. Please upload a clear photo of the concert ticket.",
        },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: 'openai/gpt-4o',
      output: Output.object({
        schema: extractedConcertSchema,
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this concert ticket image and fill in exactly the schema fields. Do not add extra fields.',
            },
            {
              type: 'image',
              image: imageUrl,
            },
          ],
        },
      ],
    });

    const extractedData = result.output as ExtractedConcertData;
    return Response.json(extractedData);
  } catch {
    return Response.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
