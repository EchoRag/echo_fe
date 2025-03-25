import projectsReducer, { addProject } from '../projectsSlice';

describe('projectsSlice', () => {
  it('should return the initial state', () => {
    expect(projectsReducer(undefined, { type: 'unknown' })).toEqual({
      projects: [],
    });
  });

  it('should handle addProject', () => {
    const previousState = { projects: [] };
    const newProject = { name: 'Test Project', description: 'Test Description' };
    const expectedState = {
      projects: [
        {
          id: '1',
          name: 'Test Project',
          description: 'Test Description',
          status: 'active',
        },
      ],
    };

    expect(projectsReducer(previousState, addProject(newProject))).toEqual(expectedState);
  });
});
