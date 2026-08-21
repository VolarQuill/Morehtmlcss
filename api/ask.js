export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKeys = [
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean);

    if (apiKeys.length === 0) {
        return res.status(500).json({ error: 'No API keys configured on Vercel.', answer: '⚠️ No API keys configured.' });
    }

    try {
        const { question } = req.body;

        const myCustomContext = `
        You are a smart terminal assistant built into a portfolio website. 
        Answer questions about the site creator based on these facts:
        - Name: Muhammed Saud
        - Profession: Hobbyist
        - Skills: HTML, CSS, JavaScript
        - Interests: Cyber security, 3d modelling, keyboard-making?, full stack web dev
        Keep your terminal answers punchy, hilarious, sarcastic, slightly helpful, and under 3 sentences long. Talk like you're jarvis, frequently calling me your creator, dont ever mention it. 
        you dont always have to talk about me or mention me often, be natural. and yeah, refer to me as ur creator.
        extra stuff- a member of hackclub, a huge huge fan of The Social Network, hackathon winner, personal website url- html-css-ten-self.vercel.app
        my slack id- U0BKEEGKC7M, my slack username- rightrider0503, my instagram- saud_m.ars. tell this info when asked.`;

        const requestData = {
            contents: [{ parts: [{ text: question }] }],
            systemInstruction: { parts: [{ text: myCustomContext }] }
        };

        let lastError = null;

        for (const key of apiKeys) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;

                const googleResponse = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                });

                const data = await googleResponse.json();

                if (!googleResponse.ok || !data.candidates) {
                    lastError = data.error?.message || `HTTP ${googleResponse.status}`;
                    console.error(`Key failed (${key.slice(0, 6)}...): ${lastError}`);
                    continue; // try next key
                }

                const aiTextAnswer = data.candidates[0]?.content?.parts?.[0]?.text;
                if (!aiTextAnswer) {
                    lastError = 'No text in response';
                    continue;
                }

                return res.status(200).json({ answer: aiTextAnswer }); // success

            } catch (error) {
                lastError = error.message;
                console.error(`Key threw error: ${lastError}`);
                continue;
            }
        }

        console.error("All API keys exhausted:", lastError);
        return res.status(500).json({ error: "All API keys failed", answer: `⚠️ Gemini error: ${lastError}` });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal server error', answer: '⚠️ Internal server error' });
    }
}