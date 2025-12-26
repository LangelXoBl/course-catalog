import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import type { CourseFormData, CourseLevel, CourseCategory } from '../types/Course';

interface Props {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  submitButtonText: string;
}

const defaultFormData: CourseFormData = {
  title: '',
  description: '',
  instructor: '',
  level: 'beginner',
  category: 'web_development',
  start_date: '',
  duration: '',
};

export const CourseForm = ({
  initialData = defaultFormData,
  onSubmit,
  submitButtonText,
}: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'El instructor es requerido';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'La duración es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      navigate('/');
    }
  };

  const handleChange = (field: keyof CourseFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 p-4">
      <div>
        <label className="block text-lg" htmlFor="title">
          Título <span className="text-danger">*</span>
        </label>
        <input
          className={`w-full p-2 border-2 rounded-lg ${
            errors.title ? 'border-danger' : ' border-tertiary'
          }`}
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        {errors.title && <span className="text-danger">{errors.title}</span>}
      </div>

      <div>
        <label htmlFor="description">
          Descripción <span className="text-danger">*</span>
        </label>
        <textarea
          className={`w-full p-2 border-2 rounded-lg ${
            errors.description ? 'border-danger' : ' border-tertiary'
          }`}
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
        />
        {errors.description && <span className="text-danger">{errors.description}</span>}
      </div>

      <div>
        <label htmlFor="instructor">
          Instructor <span className="text-danger">*</span>
        </label>
        <input
          className={`w-full p-2 border-2 rounded-lg ${
            errors.instructor ? 'border-danger' : ' border-tertiary'
          }`}
          type="text"
          id="instructor"
          value={formData.instructor}
          onChange={(e) => handleChange('instructor', e.target.value)}
        />
        {errors.instructor && <span className="text-danger">{errors.instructor}</span>}
      </div>

      <div className="flex justify-between gap-8">
        <div className="w-full">
          <label htmlFor="level">
            Nivel <span className="text-danger">*</span>
          </label>
          <select
            className="w-full p-2 border-2 border-tertiary rounded-lg bg-surface"
            id="level"
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value as CourseLevel)}
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="category">
            Categoría <span className="text-danger">*</span>
          </label>
          <select
            className="w-full p-2 border-2 border-tertiary rounded-lg bg-surface"
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value as CourseCategory)}
          >
            <option value="web_development">Desarrollo Web</option>
            <option value="mobile_development">Desarrollo Móvil</option>
            <option value="data_science">Ciencia de Datos</option>
            <option value="design">Diseño</option>
            <option value="business">Negocios</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between gap-8">
        <div className="w-full">
          <label htmlFor="start_date">
            Fecha de inicio <span className="text-danger">*</span>
          </label>
          <input
            className={`w-full p-2 border-2 rounded-lg ${
              errors.start_date ? 'border-danger' : ' border-tertiary'
            }`}
            type="date"
            id="start_date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
          />
          {errors.start_date && <span className="text-danger">{errors.start_date}</span>}
        </div>

        <div className="w-full">
          <label htmlFor="duration">
            Duración <span className="text-danger">*</span>
          </label>
          <input
            className={`w-full p-2 border-2 rounded-lg ${
              errors.duration ? 'border-danger' : ' border-tertiary'
            }`}
            type="text"
            id="duration"
            placeholder="Ej: 8 horas"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
          />
          {errors.duration && <span className="text-danger">{errors.duration}</span>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="p-2 rounded-md font-medium bg-primary hover:bg-primary/10 hover:text-primary"
          type="submit"
        >
          {submitButtonText}
        </button>
        <button
          className="p-2 rounded-md font-medium bg-muted hover:bg-muted/10 hover:text-muted"
          type="button"
          onClick={() => navigate('/')}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
