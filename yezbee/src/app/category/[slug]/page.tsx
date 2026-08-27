
import ClientPage from './ClientPage';

export async function generateStaticParams() {
    return [{"slug":"default"}];
}

export default function Page(props: any) {
    return <ClientPage {...props} />;
}
