import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ServiceInjectionExample, {
  MyService,
} from '../../react/service-injection/ServiceInjectionExample';
import { useService } from '@ng2react/support';

jest.mock('@ng2react/support');

const mockUseService = useService as jest.MockedFunction<typeof useService>;

describe('ServiceInjectionExample', () => {
  const mockMyService: MyService = {
    message: '',
    setMessage: jest.fn().mockResolvedValue(undefined),
    getMessage: jest.fn().mockResolvedValue('Test message'),
  };

  beforeEach(() => {
    mockUseService.mockReturnValue(mockMyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render and update message', async () => {
    const { getByLabelText, getByText } = render(<ServiceInjectionExample />);

    const input = getByLabelText('Message');
    const button = getByText('Send');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockMyService.setMessage).toHaveBeenCalledWith('New message');
      expect(mockMyService.getMessage).toHaveBeenCalled();
    });
  });

  it('should handle error when updating message', async () => {
    mockMyService.setMessage.mockRejectedValue(new Error('Update failed'));

    const { getByLabelText, getByText } = render(<ServiceInjectionExample />);

    const input = getByLabelText('Message');
    const button = getByText('Send');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockMyService.setMessage).toHaveBeenCalledWith('New message');
      expect(mockMyService.getMessage).not.toHaveBeenCalled();
      expect(input).toHaveValue('Error: Update failed');
    });
  });
});
