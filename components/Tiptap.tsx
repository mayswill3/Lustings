'use client'

import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji'
import suggestion from './suggestion'
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaListUl, FaQuoteRight } from 'react-icons/fa'

interface TiptapProps {
    initialSummary?: string;
    initialDetails?: string;
}

interface TiptapHandle {
    getSummary: () => string;
    getDetails: () => string;
}

export const Tiptap = forwardRef<TiptapHandle, TiptapProps>(({ initialSummary = '', initialDetails = '' }, ref) => {
    const [summary, setSummary] = useState('');
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            BulletList,
            HorizontalRule,
            Emoji.configure({
                emojis: gitHubEmojis,
                enableEmoticons: true,
                suggestion,
            }),
        ],
        content: '',
        onUpdate({ editor }) {
            console.log('Editor content updated:', editor.getHTML());
        },
    })

    // Set initial content for the editor
    useEffect(() => {
        if (editor) {
            editor.commands.setContent(initialDetails);
        }
    }, [editor, initialDetails]);

    // Update summary when initialSummary prop changes
    useEffect(() => {
        setSummary(initialSummary || '');
    }, [initialSummary]);

    useImperativeHandle(ref, () => ({
        getSummary: () => summary,
        getDetails: () => editor?.getHTML() || '',
    }));

    return (
        <div className="mt-4 sm:mt-8">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white mb-3 sm:mb-4">
                About You
            </h2>

            {/* Summary Section */}
            <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Summary
                </label>
                <input
                    className="w-full h-9 sm:h-10 border border-gray-300 rounded-lg px-3 dark:bg-zinc-800 text-sm dark:border-zinc-700 dark:text-white focus:outline-none"
                    type="text"
                    id="name"
                    name="name"
                    minLength={4}
                    maxLength={80}
                    placeholder="Enter a brief summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />
            </div>

            {/* Details Section */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Details
                </label>

                {/* Tiptap Toolbar */}
                {/* Tiptap Toolbar */}
                {editor && (
                    <div className="relative border border-gray-300 bg-gray-100 rounded-t-lg dark:bg-zinc-800 dark:border-zinc-700">
                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="flex gap-1 sm:gap-2 p-2 sm:p-3">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('bold')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Bold"
                                >
                                    <FaBold className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('italic')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Italic"
                                >
                                    <FaItalic className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleStrike().run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('strike')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Strikethrough"
                                >
                                    <FaStrikethrough className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('underline')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Underline"
                                >
                                    <FaUnderline className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('heading', { level: 1 })
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Heading 1"
                                >
                                    <span className="text-xs sm:text-sm font-bold">H1</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('heading', { level: 2 })
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Heading 2"
                                >
                                    <span className="text-xs sm:text-sm font-bold">H2</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('heading', { level: 3 })
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Heading 3"
                                >
                                    <span className="text-xs sm:text-sm font-bold">H3</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('blockquote')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Blockquote"
                                >
                                    <FaQuoteRight className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={`p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center ${editor.isActive('bulletList')
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    title="Bullet List"
                                >
                                    <FaListUl className="text-xs sm:text-sm" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                                    className="p-1.5 sm:p-2 border rounded min-w-[32px] min-h-[32px] flex items-center justify-center bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    title="Horizontal Rule"
                                >
                                    <span className="text-xs sm:text-sm">—</span>
                                </button>
                            </div>
                        </div>
                        {/* Optional: Add fade effect on edges to indicate scrolling */}
                        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-gray-100 dark:from-zinc-800 to-transparent pointer-events-none" />
                        <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-gray-100 dark:from-zinc-800 to-transparent pointer-events-none" />
                    </div>
                )}
                {/* Tiptap Editor */}
                <div className="border border-gray-300 rounded-b-lg dark:border-zinc-700">
                    <EditorContent
                        editor={editor}
                        className="p-2 sm:p-4 dark:bg-zinc-800 focus:outline-none min-h-[150px] [&_.ProseMirror]:dark:text-white"
                    />
                </div>
            </div>
        </div>
    )
})
