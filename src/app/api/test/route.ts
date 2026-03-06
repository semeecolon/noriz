export async function GET() {
  return Response.json({
    message: 'Hello from OpenNext API',
    timestamp: new Date().toISOString(),
  });
}
