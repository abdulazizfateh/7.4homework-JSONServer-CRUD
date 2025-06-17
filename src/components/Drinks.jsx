import React, { useEffect, useState } from 'react'
import { api } from '../api/api';
// Antd
import { Image, Button, Popconfirm, Modal, Form, Input, Rate, Empty } from 'antd';
// Icons (Antd)
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const Drinks = () => {
    const [data, setData] = useState([]);
    const [editDrink, setEditDrink] = useState(null);
    const [rated, setRated] = useState(false);

    // Get/Render Data
    useEffect(() => {
        api.get("/drinks")
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(response.data);
            })
    }, []);


    // Delete PopConfrim
    const confirm = id => {
        api.delete(`/drinks/${id}`);
    };


    // Create Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setEditDrink(null);
    };


    // Create/Edit Form
    const onFinish = values => {
        if (editDrink) {
            api.put(`/drinks/${editDrink.id}`, values);
        } else {
            api.post("/drinks", values)
        }
    };

    const handleEdit = (drink) => {
        setIsModalOpen(true);
        setEditDrink(drink);
    }

    // Rate
    const handleRate = (rate, drink) => {
        console.log(rate);
        console.log(drink);
        api.put(`/drinks/${drink.id}`, { ...drink, rate: rate }).then(() => { }).catch(() => { }).finally(() => {
            setRated(true);
        });
    }
    return (
        <section className='section_drinks'>
            <video className='w-full h-screen object-cover relative' autoPlay muted loop src="https://www.ursu9.es/videos/intro/video_desktop.mp4"></video>
            <p className='p-6 pt-20 sm:p-10 md:p-16 lg:p-20 xl:pl-40 text-start w-full absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/4 text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl'>A drop of health <br /><span className='!font-[G9]'>and well-being.</span></p>
            <div className='container mx-auto'>
                <div className='drinks_wrapper py-12'>
                    <h1 className='mb-5 !font-[G5] text-2xl'>Discover our offers for your <span className='text-primary !font-[G7]'>summer</span></h1>
                    <div className='grid min-[370px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:grid-cols-5'>
                        {
                            data?.map(drink => (
                                <div key={drink.id} className='!overflow-hidden border border-gray-200 rounded-lg flex flex-col'>
                                    <div className='flex items-center justify-center'>
                                        <Image width="100%" className='!h-48 sm:!h-80 !object-cover'
                                            src={drink.image}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 p-3'>
                                        <p className='text-sm !font-[G7] md:text-base'>{drink.title}<span className='capitalize'> - {drink.type}</span></p>
                                        <p className='text-xs md:text-sm'>{drink.price} UZS</p>
                                        <div className='flex items-center gap-1  h-[30px] md:h-[42.5px]'>
                                            <span className='text-xs md:text-sm text-gray-600'>Company: </span>
                                            {
                                                drink.company.startsWith("https:/") ?
                                                    <img src={drink.company} className='w-[45px] md:w-[60px]' alt="" /> :
                                                    <span>{drink.company}</span>
                                            }
                                        </div>
                                        <div>
                                            <Rate onChange={(value) => handleRate(value, drink)} disabled={rated} className='!text-primary !text-lg' allowHalf defaultValue={drink.rate} />
                                        </div>
                                    </div>
                                    <div className='flex items-end flex-1'>
                                        <button onClick={() => handleEdit(drink)} className='cursor-pointer p-1 sm:p-2 border-t border-r border-gray-200 flex-1 text-gray-500 hover:text-primary duration-150 ease-out'><EditOutlined className='text-sm sm:text-base' /></button>
                                        <Popconfirm
                                            title="Delete"
                                            description="Are you sure to delete this drink?"
                                            onConfirm={() => confirm(drink.id)}
                                            okText="Yes"
                                            cancelText="No"
                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            okButtonProps={{
                                                style: {
                                                    backgroundColor: '#28cad3',  // Tailwind red-500
                                                },
                                                className: 'hover:!bg-[#18b1b9]', // for Tailwind styling
                                            }}
                                            cancelButtonProps={{
                                                style: {
                                                    color: 'black',  // Tailwind red-500
                                                },
                                                className: 'hover:!border-[#18b1b9]', // for Tailwind styling
                                            }}
                                        >
                                            <button className='cursor-pointer p-1 sm:p-2 border-t border-gray-200 flex-1 text-gray-500 hover:text-primary duration-150 ease-out'><DeleteOutlined className='text-sm sm:text-base' /></button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='flex items-center min-h-[100px]'>
                            <Button type="primary" className='!bg-primary hover:!bg-[#18b1b9]' onClick={showModal}>
                                Add your favourite drink
                            </Button>
                            {
                                isModalOpen &&
                                <Modal
                                    title={editDrink ? "Edit" : "Add a new drink"}
                                    open={isModalOpen}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    footer={false}
                                >
                                    <Form
                                        name="basic"
                                        initialValues={editDrink}
                                        onFinish={onFinish}
                                        autoComplete="on"
                                        layout='vertical'
                                    >

                                        <Form.Item
                                            label="Title"
                                            name="title"
                                            rules={[{ required: true, message: 'Please input title!' }]}
                                        >
                                            <Input className='!w-full' placeholder='Ursu 9' />
                                        </Form.Item>

                                        <Form.Item
                                            label="Type"
                                            name="type"
                                            rules={[{ required: true, message: 'Please input type!' }]}
                                        >
                                            <Input placeholder='Still, Sparkling...' />
                                        </Form.Item>

                                        <Form.Item
                                            label="Company"
                                            name="company"
                                            rules={[{ required: true, message: 'Please input company\'s logo or name!' }]}
                                        >
                                            <Input placeholder='Company logo or name' />
                                        </Form.Item>

                                        <Form.Item
                                            label="Price"
                                            name="price"
                                            rules={[{ required: true, message: 'Please input price!' }]}
                                        >
                                            <Input placeholder='Enter in UZS' />
                                        </Form.Item>

                                        <Form.Item
                                            label="Image"
                                            name="image"
                                            rules={[{ required: true, message: 'Please input image!' }]}
                                        >
                                            <Input placeholder='URL' />
                                        </Form.Item>

                                        <Form.Item
                                            label="Rate"
                                            name="rate"
                                            rules={[{ required: true, message: 'Please input rate!' }]}
                                        >
                                            <Rate allowHalf className='!text-primary !text-lg' />
                                        </Form.Item>

                                        <Form.Item label={null}>
                                            <Button className='w-full !bg-primary' type="primary" htmlType="submit">
                                                {
                                                    editDrink ? "Save" : "Add"
                                                }
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            }
                        </div>
                    </div>
                    {
                        !data.length && <div className='flex items-center justify-center w-full h-[70dvh]'><Empty /></div>
                    }
                </div>
            </div>
        </section>
    )
}

export default Drinks