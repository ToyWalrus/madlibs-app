import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useDispatch, useSelector } from '@/store';
import { addNewTemplate, editTemplate, selectTemplate } from '@/store/templatesSlice';

interface CreateTemplateProps {
	templateId?: string;
}

export function CreateTemplate({ templateId }: CreateTemplateProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { title, setTitle, text, setText } = useStatefulTemplate(templateId);

	const isNew = !templateId;

	const onSave = () => {
		if (isNew) {
			dispatch(addNewTemplate({ title, text }));
		} else {
			dispatch(editTemplate({ id: templateId, template: { text, title } }));
		}

		navigate('/templates');
	};

	return (
		<div>
			<div className="card">
				<a href="#" className="back-link" onClick={() => navigate(-1)}>
					← Back
				</a>
				<h2 style={{ marginBottom: 8 }}>{isNew ? 'Create' : 'Edit'} Template</h2>

				<div className="input-group">
					<label htmlFor="templateTitle">Title</label>
					<input
						type="text"
						id="templateTitle"
						placeholder="My Silly Story"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
				</div>

				<div className="input-group">
					<label htmlFor="templateText">Template</label>
					<textarea
						id="templateText"
						value={text}
						placeholder="Today I went to the [noun] and saw a [adjective] [animal]. It was [verb]ing!"
						onChange={e => setText(e.target.value)}
					></textarea>
					<div className="help-text">
						Use [category] to mark where words go. Example: [noun], [sound], [famous person]
					</div>
					<div className="help-text">
						Pro Tip: use ":#" to use the same word throughout the story. Example: My friend is named [girl
						name:1]. [girl name:1] is really cool!
					</div>
				</div>

				<button className="btn btn-success" onClick={onSave}>
					Save Template
				</button>
			</div>
		</div>
	);
}

function useStatefulTemplate(templateId?: string) {
	const existingTemplate = useSelector(state => selectTemplate(state, templateId));

	const [title, setTitle] = useState(existingTemplate?.title ?? '');
	const [text, setText] = useState(existingTemplate?.text ?? '');

	return {
		title,
		text,

		setTitle,
		setText,
	};
}
