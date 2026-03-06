interface Params {
  code: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    let { code } = await params;

    // 유효성 검증: 영문/숫자만, 최대 6자
    if (!code || code.length > 6 || !/^[a-zA-Z0-9]+$/.test(code)) {
      return Response.json(
        { error: 'Invalid stock code. Must be alphanumeric and max 6 characters.' },
        { status: 400 }
      );
    }

    // 소문자를 대문자로 변환
    code = code.toUpperCase();

    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 추출 (기본값 설정)
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const firstPageSize = searchParams.get('firstPageSize') || '5';

    // Naver API URL 구성
    const naverUrl = new URL(
      `https://m.stock.naver.com/api/etf/${code}/dividend/history`
    );
    naverUrl.searchParams.set('page', page);
    naverUrl.searchParams.set('pageSize', pageSize);
    naverUrl.searchParams.set('firstPageSize', firstPageSize);

    // 외부 API 호출
    const response = await fetch(naverUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Stock API error:', error);
    return Response.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
