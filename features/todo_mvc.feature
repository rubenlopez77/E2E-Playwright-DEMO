Feature: TodoMVC Management
  As a user
  I want to manage my tasks
  So that I can keep track of what I need to do


@ID=TEST-001
@story=001
@requirement=REQ-E2E-01
@component=TaskManagement
@smoke
Scenario: User can manage tasks and state is preserved
"""
Acceptance Criteria covered (as defined in the exercise) — informative:
  1. Navigate to: https://demo.playwright.dev/todomvc/
  2. Add two tasks.
  3. Mark one as completed.
  4. Validate the counter shows “1 item left”.
  5. Refresh the page and verify the state is preserved.
  6. Delete all tasks and validate the list is empty.
"""
    Given I am on the TodoMVC page

    When I add a task "Create a MVP"
    And I add a task "Write documentation"
    And I mark the task "Create a MVP" as completed

    Then the active task text should be "1 item left"
    And the task "Create a MVP" should be completed

    When I reload the page

    Then the active task text should be "1 item left"
    And the task "Create a MVP" should be completed

    When I delete all tasks

    Then the task list should be empty

