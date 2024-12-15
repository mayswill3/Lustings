import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';

interface EmojiItem {
    name: string;
    emoji?: string;
    fallbackImage?: string;
}

interface EmojiListProps {
    items: EmojiItem[]; // List of emoji items
    command: (item: { name: string }) => void; // Command function for item selection
}

export const EmojiList = forwardRef((props: EmojiListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command({ name: item.name });
        }
    };

    const upHandler = () => {
        setSelectedIndex(
            ((selectedIndex + props.items.length) - 1) % props.items.length
        );
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: (x: { event: KeyboardEvent }) => {
            if (x.event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (x.event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (x.event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }), [upHandler, downHandler, enterHandler]);

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col gap-1 overflow-auto p-2 relative max-h-64">
            {props.items.map((item, index) => (
                <button
                    className={`flex items-center gap-2 text-left w-full px-2 py-1 rounded-lg ${index === selectedIndex
                        ? 'bg-gray-200'
                        : 'hover:bg-gray-100'
                        }`}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    {item.fallbackImage ? (
                        <img src={item.fallbackImage} alt="" className="h-4 w-4" />
                    ) : (
                        <span>{item.emoji}</span>
                    )}
                    <span>:{item.name}:</span>
                </button>
            ))}
        </div>
    );
});
