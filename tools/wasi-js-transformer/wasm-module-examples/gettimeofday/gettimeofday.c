#include <stdio.h>
#include <sys/time.h>

int main(void)
{
    struct timeval tv;
    gettimeofday(&tv, NULL);
    int64_t time = (int64_t)tv.tv_sec * 1000 + (tv.tv_usec / 1000);
    time += 1;
    return 0;
}
