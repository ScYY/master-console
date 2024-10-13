import React, { useEffect, useState } from "react";
import { getAppList } from '../services/app'
import { Avatar, Card, Col, Layout, Row, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "umi";
import docs from "@/pages/app";


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function HomePage() {
    const [appList, setAppList] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getAppList()
            .then((res: any) => {
                if (res.success === true) {
                    setAppList(res.data);
                } else {
                    setError('Failed to fetch app list.');
                }
            })
            .catch((err) => {
                setError('An error occurred while fetching app list.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ margin: 25 }}>
            {loading ? (
                <Spin indicator={antIcon} style={{ marginTop: '50px' }} />
            ) : error ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {appList.map((app) => (
                        <Col span={8} key={app.id}>
                            <Card
                                title={app.name}
                                bordered={false}
                                style={{ marginBottom: 16 }}
                                actions={[
                                    <Space>
                                        <Link to={'/app/' + app.id} >查看详情</Link>
                                        <a href="#">Action 2</a>
                                    </Space>,
                                ]}
                            >
                                <p>{app.description}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
