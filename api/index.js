module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Only POST allowed');
    }

    const data = req.body;
    const feishu_url = process.env.FEISHU_WEBHOOK;

    // 这里放入之前写的格式转换逻辑...
    const payload = {
        msg_type: "text",
        content: { text: `GitCode 通知: ${data.object_attributes?.title || '变更'}` }
    };

    const response = await fetch(feishu_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    res.status(200).send('Done');
};