import { QuestionCollection } from "inquirer";
import { Command } from "./Command";
import { prompt } from "../services";

/**
 * A blueprint for command that prompts the user for questions.
 * This abstract class provides a structure to storing and prompting for user
 * inputs.
 * <br/> Please pass in the structure of user input (key-value) as T.
 */
export abstract class QuestionCommand<
  T extends Record<string, any> = any
> extends Command {
  protected userInput: Partial<T> | undefined;
  /** Optional keys in `userInput`. This array is used in methods such as
   * `promptForInputs` so that empty strings will not be added to `userInput`
   * record. Also used as default keys in `sanitizeInput`. */
  protected optionalFields: (keyof T)[] = [];

  /** Process `this.opts` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapOptionsToInputs(): void | Promise<void> {}

  /** Process `this.args` and set `this.userInput`. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected mapArgumentsToInputs(): void | Promise<void> {}

  protected commandDidInit() {
    super.commandDidInit();
    this.mapOptionsToInputs();
    this.mapArgumentsToInputs();
  }

  /** Display `questions` with `this.userInput` as the default.
   * Set the answers to `this.userInput`. If you want to manage how
   * the prompt result is used, please refer to the `prompt` api directly. */
  protected async promptForInputs(
    questions: QuestionCollection<T>
  ): Promise<void> {
    const userInput = await prompt.show<T>(questions, this.userInput);
    this.optionalFields.forEach((field) => {
      // Remove null values if field is optional.
      if (field in userInput && !userInput[field]) {
        delete userInput[field];
      }
    });
    this.userInput = userInput;
  }

  protected sanitizeUserInput(optionalFields?: (keyof T)[]) {}
}
