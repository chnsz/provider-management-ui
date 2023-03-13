import Overview from '@/pages/api/changes/components/overview';
import {useEmotionCss} from '@ant-design/use-emotion-css';

export default () => {
    const className = useEmotionCss(() => {
        return {height: 'calc(100vh - 120px)'};
    });

    return (
        <div className={className}>
            <Overview/>
        </div>
    );
};
