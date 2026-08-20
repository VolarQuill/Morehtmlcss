export default async function handler(req, res) {

    if (req. method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed'});
    }

    const GEMINI_API_KEY = ProcessingInstruction.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Missing API Key configuration on Vercel.'});
    }
    
    try{
        const { question } = req.body;
        const url = `https://googleapis.com{GEMINI_API_KEY}`;
        const myCustomContext = `
        You are a smart terminal assistant built into a portfolio website. 
        Answer questions about the site creator based ONLY on these facts:
        - Name: Muhammed Saud
        - Profession: Hobbiyst
        - Skills: HTML, CSS, JavaScript, UI/UX Animations
        - Interests: Cyber security, 3d modelling, keyboard-making?, full stack web dev
        Keep your terminal answers punchy, very hilarious, slightly helpful and under 3 sentences long.
        `;

        const requestData = {
            contents: [{ parts: [{ text: question}] }],
            systemInstructions: { parts: [{ text: myCustomContext}] }
        };

        const data = await googleResponse.json();
        const aiTextAnswer = data.candidates.content.parts.text;

        return res.status(200).json({ answer: aiTextAnswer});

    }   catch (error) {
        console.error("Vercel Backend Error:", error);
        return res.status(500).json({ error: "Server processing exception"});
    }
}