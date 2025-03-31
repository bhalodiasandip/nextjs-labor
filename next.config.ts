import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
 
const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
};
 
const withNextIntl = createNextIntlPlugin();
export default withFlowbiteReact(withNextIntl(nextConfig));