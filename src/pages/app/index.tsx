import { useParams } from "umi";
import React, { useEffect, useState } from "react";
import { getFieldListByNamespaceId, getNamespaceList } from "@/services/app";
import {Tabs, List, Spin, Table, Button, Modal} from "antd";
import styles from "./index.less";

const SwitchPage = () => {
    const appId = useParams().appId || '';

    const [tabList, setTabList] = useState<Namespace[]>([]);
    const [fieldList, setFieldList] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        setError(null);
        getNamespaceList(appId)
            .then((res: any) => {
                if (res.success === true) {
                    if (res.data === null || res.data.length === 0) {
                        setError('当前应用暂时没有命名空间，快去设置吧');
                        return;
                    }
                    setTabList(res.data);
                    const namespace = res.data[0];
                    setActiveTab(namespace.id);
                    queryFieldList(namespace.id);
                } else {
                    setError('获取应用命名空间失败:' + res.message);
                }
            })
            .finally(() => setLoading(false));
    }, [appId]);

    const queryFieldList = (namespaceId: string) => {
        setLoading(true);
        setError(null);
        getFieldListByNamespaceId(namespaceId)
            .then((res: any) => {
                if (res.success === true) {
                    setFieldList(res.data);
                } else {
                    setError('获取字段列表失败:' + res.message);
                }
            })
            .catch(() => {
                setError('发生异常');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleTabChange = (namespaceId: string) => {
        setActiveTab(namespaceId);
        queryFieldList(namespaceId);
    };

    const handlePushClick = (details: string) => {
        setModalContent(details);
        setIsModalVisible(true);
    };

    const handleDistributionClick = (details: string) => {
        setModalContent(details);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '30%', // 设置列宽为30%
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: '45%', // 设置列宽为30%
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, field: Field) => (
                <span>
                  <Button type="primary" onClick={() => handlePushClick(field.id)}>
                    推送
                  </Button>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={() => handleDistributionClick(field.id)}>
                    查看分布
                  </Button>
                </span>
            ),
            width: '25%', // 设置列宽为30%
        },
    ];

    return (
        <div className={styles['switch-page']}>
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabList.map((namespace) => ({
                    key: namespace.id,
                    label: namespace.name,
                }))}
            />
            {loading ? (
                <div className={styles['spin-container']}>
                    <Spin />
                </div>
            ) : error ? (
                <div className={styles['error-container']}>
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            ) : (
                // <List
                //     className={styles['list']}
                //     dataSource={fieldList}
                //     renderItem={(field) => (
                //         <List.Item>
                //             <List.Item.Meta
                //                 title={field.name}
                //                 description={field.description}
                //             />
                //         </List.Item>
                //     )}
                // />
                <Table
                    className={styles['table']}
                    columns={columns}
                    dataSource={fieldList}
                    rowKey="name"
                />
            )}

            <Modal
                title="详细信息"
                open={isModalVisible}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                footer={[
                    <Button key="back" onClick={handleModalClose}>
                        关闭
                    </Button>,
                ]}
            >
                <div className={styles['modal-content']}>
                    <p>{modalContent}</p>
                </div>
            </Modal>
        </div>
    );
};

export default SwitchPage;