import React, { useEffect, useState } from 'react';
import { Table, Button, message, Image } from 'antd';
import * as reviewService from '../services/reviewService';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewService.getPendingReviews();
            setReviews(res.data.reviews || res.data);
            console.log(res)
        } catch (err) {
            message.error('Failed to load reviews');
        }
        setLoading(false);
    };

    useEffect(() => { loadReviews(); }, []);

    const handleApprove = async (id) => {
        try {
            await reviewService.approveReview(id);
            message.success('Review approved');
            loadReviews();
        } catch (err) {
            message.error('Approve failed');
        }
    };

    const handleReject = async (id) => {
        try {
            await reviewService.rejectReview(id);
            message.success('Review rejected');
            loadReviews();
        } catch (err) {
            message.error('Reject failed');
        }
    };

    const columns = [
        {
            title: 'Product',
            key: 'images',
            width: 120,
            render: (_, record) => (
                <Image
                    src={`${import.meta.env.VITE_IMAGE_API}${record.product?.images?.[0]}`}
                    alt="product"
                    width={60}
                />
            )
        },
        {
            title: 'Product Name',
            dataIndex: ['product', 'title'],
            key: 'productName',
            width: 160,
            ellipsis: true
        },
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            width: 120,
            ellipsis: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180,
            ellipsis: true
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            width: 250,
            ellipsis: true
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 80
        },
        {
            title: 'Review Images',
            key: 'reviewImages',
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
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <>
                    <Button size="small" type="primary" onClick={() => handleApprove(record._id)} className="mr-2">
                        Approve
                    </Button>

                    <Button size="small" danger onClick={() => handleReject(record._id)}>
                        Reject
                    </Button>
                </>
            )
        }
    ];

    return (
        <div className="min-h-screen">
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={reviews}
                loading={loading}
                scroll={{ x: 900 }}  // enables horizontal scroll only when needed
                pagination={{ pageSize: 10 }}
                expandable={{
                    expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>{record.comment}</p>
                    ),
                }}
            />
        </div>
    );
}
