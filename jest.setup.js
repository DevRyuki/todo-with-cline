// Next.js環境のモック設定
import { TextEncoder, TextDecoder } from 'util';

// グローバルオブジェクトの設定
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Next.js関連のモック
global.Request = class Request {};
global.Response = class Response {
  static json(data) {
    return new Response(JSON.stringify(data));
  }
};
global.Headers = class Headers {};

// Next.jsのuseRouterモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Next.jsのuseSessionモック
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

// Next.jsのImageコンポーネントモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Next.jsのLinkコンポーネントモック
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
