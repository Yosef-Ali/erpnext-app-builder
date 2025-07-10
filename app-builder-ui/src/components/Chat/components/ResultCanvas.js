import React from 'react';
import { Empty } from 'antd';

const ResultCanvas = ({ isLoading, content }) => {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!content) {
        return <Empty description="The results of your request will be displayed here." />;
    }

    return <div>{content}</div>;
};

export default ResultCanvas;