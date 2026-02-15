// TODO finish this.

#include <stdio.h>
#include <stdbool.h>

#define BUFFER_SIZE 100

int main()
{
    bool exit = false;

    while (!exit)
    {
        fflush(stdout);
        char name[BUFFER_SIZE];
        char content[BUFFER_SIZE];
        FILE *fptr;

        int option;

        printf("Menu: \n");
        printf("[1] create a new file \n");
        printf("[2] Exit \n");
        printf("<FC> please choose an option: ");

        scanf("%d", &option);

        switch (option)
        {
        case 1:
            printf("<FC> Enter filename: ");
            scanf("%s", name);

            printf("<FC> Enter the content: ");
            scanf("%s", content);

            fptr = fopen(name, "w");

            if (fptr == NULL)
            {
                printf("Error opening the file%s\n", name);
                return 1;
            }

            if (!fprintf(fptr, "%s", content))
            {
                printf("Error writing to file%s\n", name);
                return 1;
            }

            printf("Content written successfully\n");

            fclose(fptr);

            break;

        case 2:
            printf("Exiting...\n");
            exit = true;
            break;

        default:
            printf("Invalid option\n");
            return 0;
        }
    }

    return 0;
}