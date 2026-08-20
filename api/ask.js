export default async function handler(req, res) {

    // 1. Lock down the routing method channel parameters
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed'});
    }

    // FIXED: Changed ProcessingInstruction to process
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Missing API Key configuration on Vercel.'});
    }
    
    try {
        const { question } = req.body;
        
        // FIXED: Re-inserted the true Google Gemini API REST route link pattern string
        const url = `https://googleapis.com{GEMINI_API_KEY}`;
        
        const myCustomContext = `
        You are a smart terminal assistant built into a portfolio website. 
        Answer questions about the site creator based ONLY on these facts:
        - Name: Muhammed Saud
        - Profession: Hobbyist
        - Skills: HTML, CSS, JavaScript, UI/UX Animations
        - Interests: Cyber security, 3d modelling, keyboard-making?, full stack web dev
        Keep your terminal answers punchy, very hilarious, slightly helpful and under 3 sentences long.
        `;

        // FIXED: Changed systemInstructions to systemInstruction (singular)
        const requestData = {
            contents: [{ parts: [{ text: question}] }],
            systemInstruction: { parts: [{ text: myCustomContext}] }
        };

        // FIXED: Inserted the actual missing fetch execution module transmission line
        const googleResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await googleResponse.json();
        
        // FIXED: Added array bracket indexes [0] so the system reads the actual text block
        const aiTextAnswer = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ answer: aiTextAnswer});


    } catch (error) {
        console.error("Vercel Backend Error:", error);
        return res.status(500).json({ error: "Server processing exception"});
    }
}
