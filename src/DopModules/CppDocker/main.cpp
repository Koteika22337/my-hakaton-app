#include "main.h"

AsyncPinger pinger;

static void handler(int s) {
    if (s == 2) // crtl+c
    {
        pinger.stop();
        exit(1);
    }
}

int main()
{
    struct sigaction sigIntHandler{};

    sigIntHandler.sa_handler = handler;
    sigemptyset(&sigIntHandler.sa_mask);
    sigIntHandler.sa_flags = 0;
    sigaction(SIGINT, &sigIntHandler, NULL);

    // Устанавливаем колбэк функцию
    pinger.set_callback([](std::string host, icmplib::PingResult result) {
        std::cout << "[CALLBACK] Host: " << host << ", Response: ";

        switch (result.response) {
        case icmplib::PingResponseType::Success:
            std::cout << "Success, time: " << result.delay << " ttl: " << static_cast<std::uint16_t>(result.ttl);
            break;
        case icmplib::PingResponseType::Timeout:
            std::cout << "Timeout";
            break;
        case icmplib::PingResponseType::Failure:
            std::cout << "Failure";
            break;
        case icmplib::PingResponseType::Unreachable:
            std::cout << "Unreachable";
            break;
        case icmplib::PingResponseType::TimeExceeded:
            std::cout << "TimeExceeded";
            break;
        default:
            std::cout << "Unknown";
        }
        std::cout << std::endl;
        });

    // Добавляем адреса для пинга (получить из C#)
    pinger.add_address("8.8.8.8");
    pinger.add_address("ya.ru");
    pinger.add_address("github.com");
    pinger.add_address("google.com");
    pinger.add_address("127.0.0.1");

    // Работаем 10 секунд
    std::this_thread::sleep_for(std::chrono::seconds(10));

    // Убираем один адрес
    pinger.remove_address("8.8.8.8");
    pinger.remove_address("127.0.0.1");
    
    while (true)
    {
        pinger.update();
        std::this_thread::sleep_for(std::chrono::milliseconds(5));
    }

    return 0;
}
