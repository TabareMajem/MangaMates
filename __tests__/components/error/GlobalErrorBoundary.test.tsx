import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';
import { fireEvent, render, screen } from '@testing-library/react';

describe('GlobalErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when no error', () => {
    render(
      <GlobalErrorBoundary>
        <div>Test content</div>
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should retry when clicking try again button', () => {
    const TestComponent = () => {
      const [shouldError, setShouldError] = useState(true);
      if (shouldError) {
        throw new Error('Test error');
      }
      return <div>Recovered</div>;
    };

    render(
      <GlobalErrorBoundary>
        <TestComponent />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Try Again'));
    
    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });
});
