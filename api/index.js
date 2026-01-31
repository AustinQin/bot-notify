// api/index.js
export default async (req, res) => {
    // 增加一个简单的 GET 访问反馈，方便你浏览器测试是否 404
    if (req.method === 'GET') {
        return res.status(200).send('Webhook server is running! Please use POST from GitCode.');
    }

    if (req.method !== 'POST') {
        return res.status(405).send('Only POST allowed');
    }

    try {
        const data = req.body;
        const feishu_url = process.env.FEISHU_WEBHOOK;

        if (!feishu_url) {
            console.error("Missing FEISHU_WEBHOOK environment variable");
            return res.status(500).send('Server config error');
        }

        // 优化提取逻辑，防止 data 为空时报错
        const issueTitle = data?.object_attributes?.title || '未知变更';
        const project = data?.project?.name || '未知项目';
        const user = data?.user?.name || '有人';

        const payload = {
            msg_type: "text",
            content: {
                text: `📢 GitCode 通知\n项目: ${project}\n标题: ${issueTitle}\n操作人: ${user}`
            }
        };

        await fetch(feishu_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        res.status(200).send('Done');
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send('Internal Error');
    }
};