import { TaskRepository } from './task.repository';
import { getIO } from '../../socket/socket';

// Define mocks BEFORE importing the service
const mockRepoFunctions = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findDashboardTasks: jest.fn(),
};

jest.mock('./task.repository', () => {
  return {
    TaskRepository: jest.fn().mockImplementation(() => mockRepoFunctions),
  };
});

jest.mock('../../socket/socket', () => ({
  getIO: jest.fn(),
}));

// Import service AFTER mocking
import { createTask, getAllTasks } from './task.service';

describe('TaskService', () => {
  let mockSocketEmit: jest.Mock;
  let mockSocketTo: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Socket Mock
    mockSocketEmit = jest.fn();
    mockSocketTo = jest.fn().mockReturnValue({ emit: mockSocketEmit });
    (getIO as jest.Mock).mockReturnValue({
      emit: mockSocketEmit,
      to: mockSocketTo,
    });
  });

  describe('createTask', () => {
    it('should create a task and emit socket event when assigned', async () => {
      const taskData = {
        title: 'New Task',
        assignedToId: 'user2',
        dueDate: '2025-01-01',
      };
      const createdTask = { ...taskData, id: 'task1', creatorId: 'user1' };

      mockRepoFunctions.create.mockResolvedValue(createdTask);

      const result = await createTask('user1', taskData);

      expect(mockRepoFunctions.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        creatorId: 'user1',
      }));
      expect(mockSocketTo).toHaveBeenCalledWith('user2');
      expect(mockSocketEmit).toHaveBeenCalledWith('taskAssigned', createdTask);
      expect(result).toEqual(createdTask);
    });

    it('should throw error if title is too long', async () => {
      const longTitle = 'a'.repeat(101);
      await expect(createTask('user1', { title: longTitle }))
        .rejects.toThrow('Invalid task title');
    });

    it('should throw error if title is missing', async () => {
      await expect(createTask('user1', { title: '' }))
        .rejects.toThrow('Invalid task title');
    });
  });

  describe('getAllTasks', () => {
    it('should call repository with correct filters', async () => {
      const filters = { status: 'ToDo' };
      mockRepoFunctions.findAllByUser.mockResolvedValue([]);

      await getAllTasks('user1', filters);

      expect(mockRepoFunctions.findAllByUser).toHaveBeenCalledWith('user1', filters);
    });
  });
});
