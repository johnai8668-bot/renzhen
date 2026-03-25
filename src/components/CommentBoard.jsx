// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, Textarea, Input, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { MessageSquare, Edit2, Trash2, Send, Paperclip } from 'lucide-react';

export function CommentBoard({
  comments,
  documentId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUser,
  $w
}) {
  const {
    toast
  } = useToast();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: '请输入评论内容',
        description: '评论内容不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      await onAddComment({
        content: newComment.trim()
      });
      setNewComment('');
      setShowCommentForm(false);
      toast({
        title: '评论成功',
        description: '评论已发布'
      });
    } catch (error) {
      toast({
        title: '评论失败',
        description: error.message || '发布评论时发生错误',
        variant: 'destructive'
      });
    }
  };
  const handleStartEdit = comment => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };
  const handleSubmitEdit = async comment => {
    if (!editedContent.trim()) {
      toast({
        title: '请输入评论内容',
        description: '评论内容不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      await onEditComment(comment.id, {
        content: editedContent.trim()
      });
      setEditingCommentId(null);
      setEditedContent('');
      toast({
        title: '修改成功',
        description: '评论已更新'
      });
    } catch (error) {
      toast({
        title: '修改失败',
        description: error.message || '修改评论时发生错误',
        variant: 'destructive'
      });
    }
  };
  const handleDelete = async comment => {
    try {
      await onDeleteComment(comment.id);
      toast({
        title: '删除成功',
        description: '评论已删除'
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: error.message || '删除评论时发生错误',
        variant: 'destructive'
      });
    }
  };
  return <Card className="mt-6 bg-white border-slate-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">留言板</h3>
          </div>
          <div className="text-sm text-slate-600">
            {comments?.length || 0} 条评论
          </div>
        </div>

        {/* 评论列表 */}
        <div className="space-y-4 mb-6">
          {comments && comments.length > 0 ? comments.map(comment => <div key={comment.id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author?.avatar} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {comment.author?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-800 text-sm">
                        {comment.author?.name || '匿名用户'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>

                    {editingCommentId === comment.id ? <div className="space-y-2">
                        <Textarea value={editedContent} onChange={e => {
                  if (e && e.target) {
                    setEditedContent(e.target.value);
                  }
                }} placeholder="修改评论内容..." rows={3} className="text-sm" />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleSubmitEdit(comment)} className="bg-blue-600 hover:bg-blue-700">
                            保存
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            取消
                          </Button>
                        </div>
                      </div> : <p className="text-sm text-slate-700 leading-relaxed">
                        {comment.content}
                      </p>}

                    {/* 操作按钮 */}
                    {editingCommentId !== comment.id && comment.author?.userId === currentUser?.userId && <div className="flex space-x-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => handleStartEdit(comment)} className="text-blue-600 hover:bg-blue-50 h-8 px-2">
                          <Edit2 className="w-3 h-3 mr-1" />
                          修改
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(comment)} className="text-red-600 hover:bg-red-50 h-8 px-2">
                          <Trash2 className="w-3 h-3 mr-1" />
                          删除
                        </Button>
                      </div>}
                  </div>
                </div>
              </div>) : <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无评论，快来发表第一条评论吧！</p>
            </div>}
        </div>

        {/* 添加评论表单 */}
        {!showCommentForm ? <Button onClick={() => setShowCommentForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            发表评论
          </Button> : <div className="space-y-3">
            <Textarea value={newComment} onChange={e => {
          if (e && e.target) {
            setNewComment(e.target.value);
          }
        }} placeholder="写下你的评论..." rows={4} />
            <div className="flex space-x-2">
              <Button onClick={handleSubmitComment} className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                发送
              </Button>
              <Button variant="outline" onClick={() => {
            setShowCommentForm(false);
            setNewComment('');
          }}>
                取消
              </Button>
            </div>
          </div>}
      </div>
    </Card>;
}
export default CommentBoard;