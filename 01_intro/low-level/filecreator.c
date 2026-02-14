// TODO finish this.

#include <stdio.h>
#include <stdbool.h>

int main()
{
    bool exit = false;

    while (!exit)
    {
        char *name;
        char *content;

        int option;

        printf("Menu: \n");
        printf("[1] create a new file \n");
        printf("[2] Exit \n");
        printf("<FC> please choose an option: ");

        scanf("%d", &option);

        switch (option)
        {
        case 1:
            printf("<FC> Enter filename:");
            scanf("%s", &name);
            printf("<FC> Enter the content:");
            scanf("%s", &content);
            break;

        case 2:
            printf("Exiting...\n");
            exit = true;
            break;

        default:
            break;
        }
    }

    return 0;
}