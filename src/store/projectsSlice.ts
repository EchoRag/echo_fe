import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
}

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<{ name: string; description: string }>) => {
      const newProject: Project = {
        id: (state.projects.length + 1).toString(),
        name: action.payload.name,
        description: action.payload.description,
        status: 'active',
      };
      state.projects.push(newProject);
    },
    // Add other reducers as needed
   updateProject: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>
    ) => {
      const { id, name, description } = action.payload;
      const project = state.projects.find((proj) => proj.id === id);
      if (project) {
        project.name = name;
        project.description = description;
      }
    },
  },
});

export const { addProject,updateProject } = projectsSlice.actions;
export default projectsSlice.reducer;
