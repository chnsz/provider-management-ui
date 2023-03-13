import {CopyrightOutlined} from '@ant-design/icons';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const footClassName = useEmotionCss(() => {
        return {
            color: 'rgba(0,0,0,.45)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'justify',
            verticalAlign: 'middle',
            height: '60px',
        };
    });

    return (
        <div className={footClassName}>
            Copyright <CopyrightOutlined style={{margin: '0 4px'}}/>
            {currentYear} 华为云 · 太湖生态团队
        </div>
    );
};

export default Footer;
