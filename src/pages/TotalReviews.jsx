import React, { useEffect, useState } from 'react';
import { Table, Button, message, Image, Popconfirm } from 'antd';
import * as reviewService from '../services/reviewService';

export default function TotalReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewService.getAllAcceptedReviews();
            console.log(res.data);

            setReviews(res.data.pendingReviews || res.data);
        } catch (err) {
            message.error("Failed to load approved reviews");
        }
        setLoading(false);
    };

    useEffect(() => { loadReviews(); }, []);

    const handleDelete = async (id) => {
        try {
            await reviewService.deleteReview(id);
            message.success("Review deleted");
            loadReviews();
        } catch (err) {
            message.error("Delete failed");
        }
    };

    const columns = [
        {
            title: 'Product',
            key: 'images',
            width: 100,
            render: (_, record) => (
                <Image
                    src={record.product?.images?.[0]}
                    width={60}
                />
            )
        },
        {
            title: "Product Name",
            dataIndex: ["product", "title"],
            width: 180,
            ellipsis: true
        },
        {
            title: "User",
            dataIndex: "username",
            width: 120,
            ellipsis: true
        },
        {
            title: "Email",
            dataIndex: "email",
            width: 180
        },
        {
            title: "Rating",
            dataIndex: "rating",
            width: 80
        },
        {
            title: "Comment",
            dataIndex: "comment",
            ellipsis: true,
            width: 200
        },
        {
            title: 'Review Images',
            width: 150,
            render: (_, record) => (
                <>
                    {record.images?.map((img, i) => (
                        <Image key={i} src={img} width={70} className="mr-2" />
                    ))}
                </>
            )
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this review?"
                    onConfirm={() => handleDelete(record._id)}
                >
                    <Button size="small" danger>Delete</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div className='min-h-screen'>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={reviews}
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
            />
        </div>
    );
}
