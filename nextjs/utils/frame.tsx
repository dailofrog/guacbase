// frame.tsx

export interface Button {
    label: string;
}

export interface Frame {
    img: string;
    buttons: Button[];
    posturl: string;
}

export function buildFrameMeta(frame:Frame) {
    let meta =  `
<meta charset="utf-8">
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="${frame.img}" />
<meta property="fc:frame:post_url" content="${process.env.API_SERVER + "/" + frame.posturl}" />
`;

    frame.buttons.forEach((button, index) => {
        meta += 
`<meta property="fc:frame:button:${index + 1}" content="${button.label}" />
<meta property="fc:frame:button:${index + 1}:action" content="${button.redirect ? "post_redirect" : "post"}" />`;
    });

    return meta;
}

export function buildFrameDebugHtml(frame: Frame) {
    let buttonsHtml = frame.buttons.map(button => `<button>${button.label}${button.redirect? ` (Redirect)` : ""}</button>`).join('');

    return `
        <img style="border: 3px solid black" src=${frame.img} width="500"/>
        <div>
            ${buttonsHtml}
        </div>
        <p>Server: <strong>${process.env.API_SERVER}</strong></p>
        <p>Image URL: <strong>${frame.img}</strong></p>
        <p>Post URL: <strong>${frame.posturl}</strong></p>
    `;
}
