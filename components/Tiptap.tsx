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
        <div className="mt-8">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white mb-4">
                About You
            </h2>

            {/* Summary Section */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Summary
                </label>
                <input
                    className="w-full border border-gray-300 rounded-lg p-3 dark:bg-zinc-800 text-sm dark:border-zinc-700 dark:text-white focus:outline-none"
                    type="text"
                    id="name"
                    name="name"
                    minLength={4}
                    maxLength={80}
                    placeholder="Enter a brief summary"
                    value={summary} // Use the state value
                    onChange={(e) => setSummary(e.target.value)}
                />
            </div>

            {/* Details Section */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Details
                </label>

                {/* Tiptap Toolbar */}
                {editor && (
                    <div className="flex gap-2 px-4 py-2 border border-gray-300 bg-gray-100 rounded-t-lg dark:bg-zinc-800 dark:border-zinc-700">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-2 border rounded ${editor.isActive('bold')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Bold"
                        >
                            <FaBold />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-2 border rounded ${editor.isActive('italic')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Italic"
                        >
                            <FaItalic />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`p-2 border rounded ${editor.isActive('strike')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Strikethrough"
                        >
                            <FaStrikethrough />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-2 border rounded ${editor.isActive('underline')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Underline"
                        >
                            <FaUnderline />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`p-2 border rounded ${editor.isActive('heading', { level: 1 })
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Heading 1"
                        >
                            H1
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 border rounded ${editor.isActive('heading', { level: 2 })
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Heading 2"
                        >
                            H2
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`p-2 border rounded ${editor.isActive('heading', { level: 3 })
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Heading 3"
                        >
                            H3
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`p-2 border rounded ${editor.isActive('blockquote')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Blockquote"
                        >
                            <FaQuoteRight />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-2 border rounded ${editor.isActive('bulletList')
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                            title="Bullet List"
                        >
                            <FaListUl />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className="p-2 border rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                            title="Horizontal Rule"
                        >
                            <span>—</span>
                        </button>
                    </div>
                )}

                {/* Tiptap Editor */}
                <div className="border border-gray-300 rounded-b-lg dark:border-zinc-700">
                    <EditorContent
                        editor={editor}
                        className="p-4 dark:bg-zinc-800 focus:outline-none"
                        style={{ minHeight: '4rem' }}
                    />
                </div>
            </div>
        </div>
    )
})
