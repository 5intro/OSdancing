#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>

using namespace std;

struct PCB {
    string name;
    int arrive_time;
    int service_time;
    int start_time;
    int end_time;
    int turnaround_time;
    double weighted_turnaround;
    bool finished = false;
};

// Sort by arrival time
bool compareArrival(const PCB& a, const PCB& b) {
    return a.arrive_time < b.arrive_time;
}

// Main SJF scheduling
void SJF(vector<PCB>& processes) {
    sort(processes.begin(), processes.end(), compareArrival);

    int now = 0;
    int completed = 0;
    int n = processes.size();

    vector<PCB*> ready_queue;

    while (completed < n) {
        // Push arrived but unfinished processes to ready queue
        ready_queue.clear();
        for (auto& pcb : processes) {
            if (!pcb.finished && pcb.arrive_time <= now) {
                ready_queue.push_back(&pcb);
            }
        }

        if (ready_queue.empty()) {
            // No process is ready, jump to next arriving process
            for (auto& pcb : processes) {
                if (!pcb.finished) {
                    now = pcb.arrive_time;
                    ready_queue.push_back(&pcb);
                    break;
                }
            }
        }

        // Choose shortest service time among ready queue
        auto selected = *min_element(ready_queue.begin(), ready_queue.end(),
            [](PCB* a, PCB* b) {
                return a->service_time < b->service_time;
            });

        selected->start_time = now;
        selected->end_time = now + selected->service_time;
        selected->turnaround_time = selected->end_time - selected->arrive_time;
        selected->weighted_turnaround = (double)selected->turnaround_time / selected->service_time;
        selected->finished = true;

        now = selected->end_time;
        completed++;
    }
}

void printResult(const vector<PCB>& processes) {
    cout << left << setw(10) << "Name"
         << setw(15) << "Arrival"
         << setw(15) << "Service"
         << setw(15) << "Start"
         << setw(15) << "End"
         << setw(20) << "Turnaround"
         << setw(20) << "Weighted Turnaround" << endl;

    for (const auto& p : processes) {
        cout << left << setw(10) << p.name
             << setw(15) << p.arrive_time
             << setw(15) << p.service_time
             << setw(15) << p.start_time
             << setw(15) << p.end_time
             << setw(20) << p.turnaround_time
             << setw(20) << fixed << setprecision(2) << p.weighted_turnaround
             << endl;
    }
}

int main() {
    vector<PCB> processes = {
        {"A", 1, 8},
        {"B", 4, 2},
        {"C", 2, 10},
        {"D", 3, 3}
    };

    SJF(processes);
    printResult(processes);

    return 0;
}
