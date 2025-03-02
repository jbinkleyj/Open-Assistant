import { Box, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MessageTable } from "src/components/Messages/MessageTable";
import { Sortable } from "src/components/Sortable/Sortable";
import { SurveyCard } from "src/components/Survey/SurveyCard";
import { TaskSurveyProps } from "src/components/Tasks/Task";
import { TaskHeader } from "src/components/Tasks/TaskHeader";
import { TaskType } from "src/types/Task";
import { RankTaskType } from "src/types/Tasks";

export const EvaluateTask = ({
  task,
  taskType,
  isEditable,
  isDisabled,
  onReplyChanged,
  onValidityChanged,
}: TaskSurveyProps<RankTaskType, { ranking: number[] }>) => {
  const cardColor = useColorModeValue("gray.50", "gray.800");
  const [ranking, setRanking] = useState<number[]>(null);

  let messages = [];
  if (task.type !== TaskType.rank_initial_prompts) {
    messages = task.conversation.messages;
  }

  useEffect(() => {
    if (ranking === null) {
      if (task.type === TaskType.rank_initial_prompts) {
        onReplyChanged({ ranking: task.prompts.map((_, idx) => idx) });
      } else {
        onReplyChanged({ ranking: task.replies.map((_, idx) => idx) });
      }
      onValidityChanged("DEFAULT");
    } else {
      onReplyChanged({ ranking });
      onValidityChanged("VALID");
    }
  }, [task, ranking, onReplyChanged, onValidityChanged]);

  const sortables = task.type === TaskType.rank_initial_prompts ? "prompts" : "replies";

  return (
    <div data-cy="task" data-task-type="evaluate-task">
      <Box mb="4">
        <SurveyCard>
          <TaskHeader taskType={taskType} />
          <Box mt="4" p="6" borderRadius="lg" bg={cardColor}>
            <MessageTable messages={messages} highlightLastMessage />
          </Box>
          <Sortable
            items={task[sortables]}
            isDisabled={isDisabled}
            isEditable={isEditable}
            onChange={setRanking}
            className="my-8"
          />
        </SurveyCard>
      </Box>
    </div>
  );
};
