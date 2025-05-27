export const GET = () => {
    return new Response(JSON.stringify({message: 'hellow world'}), {status: 200,});
};