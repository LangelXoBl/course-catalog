export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseCategory =
  | 'web_development'
  | 'mobile_development'
  | 'data_science'
  | 'design'
  | 'business';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: CourseLevel;
  category: CourseCategory;
  start_date: string;
  duration: string;
}

export type CourseFormData = Omit<Course, 'id'>;
