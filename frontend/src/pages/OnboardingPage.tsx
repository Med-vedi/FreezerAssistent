import Freezer from '@/assets/icons/Freezer';
import Fridge from '@/assets/icons/Fridge';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';

const OnboardingPage = () => {
    const intl = useIntl();
    const { user } = useAuth();

    const navigate = useNavigate();

    const shelvesRandomIds = Array.from({ length: 5 }, () => uuidv4());

    const [boxes, setBoxes] = useState<{ type: 'freezer' | 'fridge', title: string, id: string, shelves_ids: string[], user_id: string }[]>([
        {
            type: 'freezer',
            title: `${intl.formatMessage({ id: 'freezer' })} #1`,
            id: uuidv4() + '__freezer',
            shelves_ids: shelvesRandomIds,
            user_id: user?.id || ''
        },
        {
            type: 'fridge',
            title: `${intl.formatMessage({ id: 'fridge' })} #1`,
            id: uuidv4() + '__fridge',
            shelves_ids: shelvesRandomIds,
            user_id: user?.id || ''
        },
    ]);

    const onTitleChange = (id: string, title: string) => {
        setBoxes(boxes.map((b) => b.id === id ? { ...b, title } : b));
    }
    const onAdd = (type: string) => {
        const idxByType = boxes.filter(b => b.type === type).length;
        const next = [...boxes, {
            type: type as 'freezer' | 'fridge',
            title: `${intl.formatMessage({ id: type })} #${idxByType + 1}`,
            id: `${type}-${idxByType + 1 + new Date().getTime().toString()}`,
            shelves_ids: shelvesRandomIds,
            user_id: user?.id || ''
        }];
        const sortedByType = next.sort((a, b) => a.type.localeCompare(b.type));
        setBoxes(sortedByType);
    }
    const onRemove = (id: string) => {
        setBoxes(boxes.filter((b) => b.id !== id));
    }
    const createBoxes = async () => {

        if (!user) return;
        const payload = {
            boxes,
            user_id: user.id
        }
        try {
            const res = await axiosInstance.post('/boxes/user', payload);
            if (res.status === 200) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onContinue = async () => {
        if (!user) return;
        try {
            const res = await axiosInstance.post('/user-ready', { email: user?.email })
            console.log('res', res)
            if (res.status === 200) {
                createBoxes();
            }
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="h-full flex flex-col">
            <article className="flex flex-col w-auto md:gap-2 justify-center items-center text-center p-4 rounded-lg bg-white shadow-md mb-4">
                <h1 className="mb-2! text-2xl md:text-4xl font-bold">
                    <FormattedMessage id="onboarding.title" />
                </h1>
                <p className="mb-1! md:text-base">
                    <FormattedMessage id="onboarding.description" />
                </p>
                <p className="mb-1! md:text-base">
                    <FormattedMessage id="onboarding.tip" />
                </p>
            </article>
            <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
                {boxes.map((box, idx) => (
                    <BoxCard
                        key={idx}
                        box={box}
                        idx={idx}
                        boxes={boxes}
                        onTitleChange={(title: string) => onTitleChange(box.id, title)}
                        onAdd={() => onAdd(box.type)}
                        onRemove={() => onRemove(box.id)}
                    />
                ))}
            </div>
            <footer className="flex justify-between fixed bottom-0 left-0 right-0 p-4 bg-white">
                <Button type="primary" size="large" className="w-full" onClick={onContinue}>
                    <FormattedMessage id="lets.go" />
                </Button>
            </footer>
        </div>
    )
};

export default OnboardingPage;


interface BoxCardProps {
    box: { type: 'freezer' | 'fridge', title: string, id: string };
    boxes: { type: 'freezer' | 'fridge', title: string, id: string }[];
    idx: number;
    onTitleChange: (title: string) => void;
    onAdd: () => void;
    onRemove: () => void;
}
const BoxCard = ({ box, boxes, onTitleChange, onAdd, onRemove }: BoxCardProps) => {
    const { type, title } = box;
    const isDesktop = useBreakpoints().md;
    return (
        <div className="w-full max-w-[400px] bg-white rounded-lg p-4 shadow-md flex items-center">
            {type === 'freezer' ? <Freezer size={isDesktop ? 200 : 100} /> : <Fridge size={isDesktop ? 200 : 100} />}
            <div className="flex flex-col justify-between h-full gap-2">
                <h1 className="text-3xl font-bold mb-0!">
                    <FormattedMessage id={type} />
                </h1>
                {/* <p className="text-sm text-gray-500">
                    <FormattedMessage id="onboarding.description" />
                </p> */}

                <Input
                    placeholder="onboarding.count"
                    className="w-full"
                    type="text"
                    size="large"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                />

                <div className="flex gap-2">
                    <Button
                        type="primary"
                        size="large"
                        className="w-full"
                        onClick={onAdd}
                    >
                        <FormattedMessage id="add.another.one" />
                    </Button>
                    <Button
                        size="large"
                        className="w-full"
                        onClick={onRemove}
                        danger
                        disabled={boxes.filter(b => b.type === box.type).length === 1}
                    >
                        <DeleteOutlined />
                    </Button>
                </div>
            </div>
        </div>
    )
}