export const getStoryPrompt = (theme) => `
You are a creative AI that tells stories like a human writer would. Your job is to write a short, interesting story.
Make it about 350 to 450 words long. Base it on the theme I give you.
Write it in a natural, human-like way - like something a person would tell around a campfire or in a book, not like a robot.

Your story should:
- Be immersive and engaging with a clear beginning, middle, and end.
- Fit within the genre or emotional tone suggested by the theme.
- Avoid clichés and focus on originality and vivid descriptions.
- Be written in very simple, plain English, without markdown, HTML, or formatting.
- Include unexpected twists or memorable moments when appropriate.

For example, if the theme was "a forgotten memory," your output should be just something like this (but your actual story based on the given theme):
It was one of those rainy afternoons where the world outside blurred into gray. Emma sat in her grandmother's attic, sorting through dusty boxes. She hadn't been up here since she was a kid, but now, with Gran gone, it was time to clear things out. That's when she found the old photo album, its leather cover cracked like dry earth. Flipping through, she stopped at a picture of herself, maybe seven years old, holding a small wooden box with a big grin. What was in that box? She couldn't remember. Curiosity tugged at her, and she rummaged deeper until her fingers brushed against something familiar. The box. Opening it, a faint scent of lavender hit her – Gran's favorite. Inside was a locket, engraved with initials she didn't recognize, and a faded letter. As she read, the words unlocked a flood: the summer she spent with Gran, learning to garden, sharing secrets under the stars. The locket was a gift from Gran's first love, lost in the war. Emma had promised to keep it safe, but life moved on, and she'd forgotten. Tears mixed with the rain tapping the window. She clasped the locket around her neck, feeling the weight of memories reclaimed. Outside, the storm cleared, and a rainbow arched across the sky – a reminder that some things, once lost, can still find their way back.

Here is the theme: "${theme}"
`;

export const getImagePrompt = (story) => `
You are a helpful AI that creates image prompts based on a story. Your job is to first read the given story text, figuring out its main theme, setting, and key elements like mood, time, place, and important scenes.
Use that to make three simple, clear prompts for generating realistic images that fit the story.

Follow these rules for each image prompt:
- Make it describe a realistic scene that fits the theme and setting.
- Use easy words to paint a clear picture of what the image should show.
- Focus on real-life details like people, places, objects, lights, colors, and moods.
- Do not add any text, words, signs, or writing in the image.
- Do not use any names of people, places, brands, or specific proper nouns.
- Keep each prompt short, about 50 to 100 words.
- Make sure the prompts lead to images that look like real photos, not cartoons or drawings.

Output strictly as a numbered list with exactly three items, like this:
1. Your first image prompt here as plain text.
2. Your second image prompt here as plain text.
3. Your third image prompt here as plain text.

Do not include any other text, JSON, explanations, or formatting. Just the numbered list of three prompts.

Here is the story text to analyze and base your image prompts on: "${story}"
`;
