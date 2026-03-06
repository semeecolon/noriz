interface Params {
  code: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> },
) {
  try {
    const { code } = await params;

    return Response.json({
      inputCode: code,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stock API error:', error);
    return Response.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 },
    );
  }
}
