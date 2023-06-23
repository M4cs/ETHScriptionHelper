import { NextResponse } from "next/server";
import { decodeBase64, ethers } from "ethers";
import axios from "axios";



function validate_txhash(hash: string)
{
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
}

export async function GET(request: Request) {
    try {
        const { pathname } = new URL(request.url);
        const txn = pathname.split('/')[3];
        if (txn && validate_txhash(txn)) {
            console.log(txn)
        } else {
            return NextResponse.json({ error: 'Transaction Not Found or Invalid Transaction Hash'}, { status: 404 });
        }
        const result = await axios({
            method: 'GET',
            url: `https://eth-script-indexer-eca25c4cf43b.herokuapp.com/api/ethscriptions/${txn}`
        })
        if (!result?.data.content_uri) {
            return NextResponse.json({ error: 'Invalid Data in Txn or null data'}, { status: 404 });
        }
        const data = result?.data.content_uri;
        const uriSplit = data.split(',');
        let content;
        if (uriSplit[0].endsWith('base64')) {
            content = Buffer.from(uriSplit[1], 'base64');
        } else {
            content = uriSplit[1];
        }
        let mimetype = data.split(',')[0].replace('data:', '');
        if (mimetype == '') {
            mimetype = 'text/plain'
        }
        return new Response(content, {
            headers: {
                'Content-Type': mimetype,
                'Content-Length': content.length
            },
            status: 200
        });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: 'Internal Server Error.'}, {status: 500});
    }
}