
// AgentTestPanel.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentTestPanel from './AgentTestPanel';

// Mock Ant Design components
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    return {
        ...antd,
        Select: ({ children, value, onChange }) => (
            <select value={value} onChange={e => onChange(e.target.value)}>
                {children}
            </select>
        ),
        Option: ({ children, value }) => <option value={value}>{children}</option>,
    };
});

describe('AgentTestPanel', () => {
    const mockOnTest = jest.fn();

    const agents = ['AGENT_1', 'AGENT_2'];
    const agentMetadata = {
        AGENT_1: { icon: '🤖', testCases: ['Test case 1', 'Test case 2'] },
        AGENT_2: { icon: '👽', testCases: ['Another test'] },
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing with default props', () => {
        render(<AgentTestPanel onTest={mockOnTest} />);
        expect(screen.getByText('Agent Test Console')).toBeInTheDocument();
    });

    test('renders with given agents and metadata', () => {
        render(<AgentTestPanel agents={agents} agentMetadata={agentMetadata} onTest={mockOnTest} />);
        expect(screen.getByText('AGENT 1')).toBeInTheDocument();
        expect(screen.getByText('AGENT 2')).toBeInTheDocument();
    });

    test('handles agent selection and displays test cases', () => {
        render(<AgentTestPanel agents={agents} agentMetadata={agentMetadata} onTest={mockOnTest} />);
        
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'AGENT_1' } });

        expect(screen.getByText('Test case 1')).toBeInTheDocument();
        expect(screen.getByText('Test case 2')).toBeInTheDocument();
    });

    test('does not crash if agent metadata is missing test cases', () => {
        const metadataWithoutTestCases = {
            AGENT_1: { icon: '🤖' },
        };
        render(<AgentTestPanel agents={['AGENT_1']} agentMetadata={metadataWithoutTestCases} onTest={mockOnTest} />);
        
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'AGENT_1' } });
        
        // No test cases should be rendered, and it shouldn't crash
        expect(screen.queryByText(/Test case/)).not.toBeInTheDocument();
    });

    test('calls onTest when a test is run', () => {
        render(<AgentTestPanel agents={agents} agentMetadata={agentMetadata} onTest={mockOnTest} />);
        
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'AGENT_1' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your test message...'), { target: { value: 'Hello agent' } });
        fireEvent.click(screen.getByText('Run Test'));

        expect(mockOnTest).toHaveBeenCalledWith('AGENT_1', 'Hello agent', expect.any(Object));
    });
});
